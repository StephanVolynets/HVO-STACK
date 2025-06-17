import { CreateCreatorDTO } from "hvo-shared";

export const formDefaultValues: CreateCreatorDTO = {
  full_name: "",
  email: "",
  username: "",
  description: "",
  youtube_channel_link: "",
  // rate: 0,
  language_ids: [],
  multiple_speakers: false,
  channels: [],
};
