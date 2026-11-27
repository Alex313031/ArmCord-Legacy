import type { Configuration } from "electron-builder";

import debianLicence from "./scripts/spdxLicenceDebianFormat";

// This file is written for electron-builder 24.13.3, not the 26.x upstream
// uses. 26 no longer produces Windows installers that start on Windows 7 and
// older, which is what this fork is for. Three things upstream's config relies
// on do not exist in 24:
//   - electronFuses: done by the afterPack hook in scripts/build/fuses.mjs
//   - toolsets: 24 has one AppImage toolchain and no setting for it
//   - desktopActions: 24 writes a flat [Desktop Entry] only, so the Linux
//     launcher shortcuts for the command line actions are not generated
// The two hooks are given as paths rather than imported: 24 compiles this file
// into a cache directory before loading it, and an imported .mjs is not there.

export const config: Configuration = {
    // Not upstream's id, so this build installs beside a stock Legcord rather
    // than over it, and Windows groups its windows separately.
    appId: "com.alex313031.legcord",
    productName: "Legcord",
    generateUpdatesFilesForAllChannels: false,
    // Biome treats electron-builder macro placeholders as template syntax.
    // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder expands these placeholders.
    artifactName: "Legcord_${version}_${os}_${arch}.${ext}",
    extraFiles: [{ from: "assets/icon.png" }],
    beforePack: "./scripts/build/sandboxFix.mjs",
    afterPack: "./scripts/build/fuses.mjs",
    protocols: [
        {
            name: "Discord",
            schemes: ["discord"],
        },
    ],
    mac: {
        category: "public.app-category.social-networking",
        darkModeSupport: true,
        icon: "build/icon.icns",
        target: ["dmg", "zip"],
        // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder expands these placeholders.
        artifactName: "Legcord_${version}_macos_${arch}.${ext}",
        notarize: true,
        extendInfo: {
            NSMicrophoneUsageDescription: "Legcord requires access to the microphone to function properly.",
            NSCameraUsageDescription: "Legcord requires access to the camera to function properly.",
            NSAudioCaptureUsageDescription:
                "Legcord requires access to system audio to share sound during screenshare.",
            NSCameraUseContinuityCameraDeviceType: true,
            "com.apple.security.device.audio-input": true,
            "com.apple.security.device.camera": true,
        },
        x64ArchFiles: "**/node_modules/koffi/**",
    },

    linux: {
        icon: "build/icons",
        target: ["zip", "AppImage", "deb", "rpm", "tar.gz"],
        maintainer: "Alex313031",
        vendor: "Alex313031",
        synopsis:
            "Legcord is a custom client designed to enhance your Discord experience while keeping everything lightweight. Legacy OS Builds.",
        category: "Network",
        executableName: "legcord",
        // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder expands these placeholders.
        artifactName: "legcord_${version}_${arch}.${ext}",
        desktop: {
            StartupWMClass: "legcord",
        },
    },

    pacman: {
        depends: ["gtk3", "libnotify", "xdg-utils", "at-spi2-core", "alsa-lib", "nspr", "nss"],
    },

    win: {
        target: ["zip", "portable", "nsis"],
        icon: "build/icon.ico",
        executableName: "Legcord",
        // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder expands these placeholders.
        artifactName: "Legcord_${version}_${arch}.${ext}",
    },

    nsis: {
        shortcutName: "Legcord",
        // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder expands these placeholders.
        artifactName: "Legcord_setup_${version}_${arch}.${ext}",
        // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder expands these placeholders.
        uninstallDisplayName: "Legcord ${version}",
        license: "license.txt",
        include: "build/installer.nsh",
        deleteAppDataOnUninstall: false,
        oneClick: false,
        allowToChangeInstallationDirectory: true,
    },

    portable: {
        // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder expands these placeholders.
        artifactName: "Legcord_portable_${version}_${arch}.${ext}",
    },

    appx: {
        applicationId: "alex313031.Legcord",
        identityName: "53758smartfrigde.Legcord",
        publisher: "CN=EAB3A6D3-7145-4623-8176-D579F573F339",
        publisherDisplayName: "Alex313031",
        backgroundColor: "white",
        showNameOnTiles: true,
    },

    snap: {
        environment: { ARRPC_NO_PROCESS_SCANNING: "true" },
        allowNativeWayland: true,
        executableArgs: ["--no-process-scanning"],
        base: "core22",
        publish: {
            provider: "snapStore",
        },
    },

    deb: {
        category: "Network",
        icon: "build/icon.icns",
        depends: [
            "libasound2",
            "libnspr4",
            "libnss3",
            "libasound2-plugins",
            "libatk1.0-0 | libatk1.0-0t64",
            "libatk-bridge2.0-0",
            "libgbm1",
            "libasound2t64 | libasound2",
            "libcups2",
            "libgtk3.0 | libgtk-3-0",
            "at-spi2-common",
        ],
        fpm: [`${debianLicence()}=/usr/share/doc/legcord/copyright`],
    },

    files: [
        "!*",
        "assets",
        "node-modules",
        "ts-out",
        "dist/venmic-arm64.node",
        "dist/venmic-x64.node",
        "package.json",
        "license.txt",
    ],

    // Electron for Legacy Windows: https://github.com/Alex313031/electron-legacy
    // The version is spelled out because the dependency is a git URL. The
    // mirror ends in "v" because electron-builder 24 appends only the bare
    // version number, and the release tags are "v<version>".
    electronVersion: "44.11.5",
    electronDownload: {
        cache: ".cache",
        version: "44.11.5",
        mirror: "https://github.com/Alex313031/electron-legacy/releases/download/v",
    },
};

export default config;
