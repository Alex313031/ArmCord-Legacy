// Electron fuses, applied after packaging.
//
// Upstream sets these through the electronFuses key of its electron-builder
// config. That key arrived in electron-builder 26; this fork builds with 24
// (see electron-builder.ts), so the same fuses are flipped here instead, with
// the same values.

import path from "node:path";
import { FuseV1Options, FuseVersion, flipFuses } from "@electron/fuses";

export async function applyFuses(context) {
    const { appOutDir, electronPlatformName, packager } = context;
    const productFilename = packager.appInfo.productFilename;

    let executable;
    switch (electronPlatformName) {
        case "win32":
            executable = `${productFilename}.exe`;
            break;
        case "darwin":
        case "mas":
            executable = `${productFilename}.app`;
            break;
        default:
            executable = packager.executableName;
    }

    await flipFuses(path.join(appOutDir, executable), {
        version: FuseVersion.V1,
        // An arm64 macOS binary stops being validly signed once it is edited.
        resetAdHocDarwinSignature: electronPlatformName === "darwin",
        [FuseV1Options.RunAsNode]: false,
        [FuseV1Options.EnableCookieEncryption]: false,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
        [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false,
        [FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
    });
}

// electron-builder loads this file by path and calls its default export.
export default applyFuses;
