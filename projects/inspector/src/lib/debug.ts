import debug from "debug";

export const baseLogger = debug("@midishare/inspector");
export const deviceLogger = baseLogger.extend("device");
export const messageStreamLogger = baseLogger.extend("messageStream");
export const midiMessageViewerLogger = baseLogger.extend("midiMessageViewer");
