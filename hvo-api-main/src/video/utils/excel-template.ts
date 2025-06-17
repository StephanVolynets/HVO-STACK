import { Workbook, Worksheet } from "exceljs";
import { YoutubeChannelBasicDTO } from "hvo-shared";
import { PassThrough } from "stream";

export const generateBulkUploadTemplate = async (channels: YoutubeChannelBasicDTO[]) => {
  console.log(channels);
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Bulk Upload");

  // Define headers
  const headers = ["title", "description", "videoUrl", "soundtrackUrl", "formType", "expectedBy", "channelId"];
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 20,
  }));

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Add data validation for formType
  (worksheet as any).dataValidations.add("E2:E1000", {
    type: "list",
    allowBlank: true,
    formulae: ['"LONG,SHORT"'],
  });

  // Add data validation for channelId
  if (channels.length > 0) {
    const channelList = channels.map((channel) => channel.title.toString()).join(",");
    (worksheet as any).dataValidations.add("G2:G1000", {
      type: "list",
      allowBlank: true,
      formulae: [`"${channelList}"`],
    });
  }

  // Add a helper row with example data
  worksheet.addRow({
    title: "Example Video Title",
    description: "Example video description",
    videoUrl: "https://example.com/video.mp4",
    soundtrackUrl: "https://example.com/audio.wav",
    formType: "LONG",
    expectedBy: new Date().toISOString().split("T")[0],
    channelId: channels[0]?.title || "",
  });

  // Create a PassThrough stream
  const stream = new PassThrough();

  // Write workbook to stream
  await workbook.xlsx.write(stream);

  // End the stream
  stream.end();

  return stream;
};
