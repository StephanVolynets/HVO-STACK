import { Injectable, Logger } from "@nestjs/common";
import { ChannelType, Client, TextChannel } from "discord.js";
import { DISCORD_DEFAULT_CHANNELS, DISCORD_INTENTS, NotificationName } from "../constants";
import { PrismaService } from "src/prisma/src/prisma.service";
import { getDiscordMessageData } from "./utils";

export type DiscordMessage = {
  color: number;
  title: string;
  url: string;
  description: string;
  channelId: string;
  author: {
    name: string;
  };
};

export interface DiscordData {
  categoryId: string;
  channels: Record<string, string>;
}

@Injectable()
export class DiscordProvider {
  private logger: Logger = new Logger("DiscordProvider");
  private client: Client;

  constructor(protected readonly prismaService: PrismaService) {
    const discordToken = process.env.DISCORD_TOKEN;

    this.client = new Client({
      intents: DISCORD_INTENTS,
    });

    this.client.login(discordToken).catch((error) => {
      this.logger.error("Discord login failed:", error);
    });
  }

  async createChannelsForCreator(creatorId: number, creatorUsername: string) {
    try {
      const guildId = process.env.DISCORD_SERVER_ID; // Replace with your actual server ID
      const guild = await this.client.guilds.fetch(guildId);

      // Create the category (group) with the username of the creator
      const category = await guild.channels.create({
        name: creatorUsername, // Category name will be the creator's name
        type: ChannelType.GuildCategory,
      });

      // Create each channel within the category
      const channelsData: Record<string, string> = {};
      await Promise.all(
        DISCORD_DEFAULT_CHANNELS.map(async (channelName) => {
          const channel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
          });
          channelsData[channelName] = channel.id;
        })
      );

      // Create and save discord data for the creator
      const discordData = {
        categoryId: category.id,
        channels: channelsData,
      };

      await this.prismaService.creator.updateMany({
        where: {
          id: creatorId,
        },
        data: {
          discordData: discordData,
        },
      });

      this.logger.log(`Discord channels created for creator: ${creatorUsername}`);
    } catch (error) {
      this.logger.error(`Failed to create channels for creator ${creatorUsername}:`, error);
      throw error;
    }
  }

  async sendMessage(message: DiscordMessage) {
    try {
      const { channelId } = message;

      // Step 2: Fetch the Channel and Send the Message
      const channel = await this.client.channels.fetch(channelId);

      if (channel instanceof TextChannel) {
        // Send an embed message
        const embed = {
          color: message.color,
          author: message.author,
          title: message.title,
          url: message.url,
          description: message.description,
        };

        await channel.send({ embeds: [embed] });

        this.logger.log(`Message sent to Discord channel: ${channelId}`);
      } else {
        this.logger.error(`Channel is not a TextChannel: ${channelId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send Discord notification: ${error.message}`, error);
    }
  }

  async sendMessageDeprecated(name: NotificationName, props: Record<string, any>, creatorId: number) {
    try {
      // Step 1: Fetch Channel Id and Generate the Message
      const result = await getDiscordMessageData(this.prismaService, this.logger, creatorId, name, props);

      console.log("result", result);

      if (!result) {
        this.logger.error(`Failed to generate message or find channel for notification "${name}"`);
        return;
      }

      const { message, channelId } = result;

      // Step 2: Fetch the Channel and Send the Message
      const channel = await this.client.channels.fetch(channelId);

      if (channel instanceof TextChannel) {
        if (message.color || message.title || message.description) {
          // Send an embed message
          const embed = {
            color: message.color,
            author: message.author,
            title: message.title,
            url: message.url,
            description: message.description,
          };

          await channel.send({ embeds: [embed] });
        } else {
          // Send a plain text message
          await channel.send(message);
        }

        this.logger.log(`Message sent to Discord channel: ${channelId}`);
      } else {
        this.logger.error(`Channel is not a TextChannel: ${channelId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send Discord notification: ${error.message}`, error);
    }
  }
}
