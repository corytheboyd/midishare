import debug from "debug";

export const baseLogger = debug("@midishare/inspector");
export const deviceLogger = baseLogger.extend("device");
export const midiMessageViewerLogger = baseLogger.extend("midiMessageViewer");
