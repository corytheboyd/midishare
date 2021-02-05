import { RecursivePartial } from "./updateSession";
import { Session } from "@midishare/common";

/**
 * Publishes Session delta as patch to clients to update their local states.
 * */
export function pushSessionPatch(patch: RecursivePartial<Session>): void {}
