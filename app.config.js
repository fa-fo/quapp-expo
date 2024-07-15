const IS_DEV = process.env.APP_VARIANT === 'development';
const versionCode = 27013;

export default {
    name: IS_DEV ? 'DEV QuattFo Quapp' : 'QuattFo Quapp',
    slug: 'quattfo-quapp',
    version: '3.0.4',
    orientation: 'default',
    scheme: 'quapp',
    icon: './assets/images/icon.png',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        supportsTablet: true,
        bundleIdentifier: IS_DEV ? 'de.quattfo.quapp.dev' : 'de.quattfo.quapp',
        buildNumber: versionCode.toString(),
        infoPlist: {
            UIBackgroundModes: [
                'remote-notification',
                'fetch'
            ],
            ITSAppUsesNonExemptEncryption: false,
            NSCameraUsageDescription: 'Die Kamera wird benötigt für den optionalen Foto-Upload nach jeder Spielprotokollierung.'
        },
        config: {
            googleServicesFile: "./GoogleService-Info.plist"
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/icon.png',
            backgroundColor: '#FFFFFF'
        },
        package: IS_DEV ? 'de.quattfo.quapp.dev' : 'de.quattfo.quapp',
        googleServicesFile: IS_DEV ? '' : './google-services.json',
        versionCode: versionCode,
        permissions: [
            'android.permission.CAMERA'
        ],
        blockedPermissions: [
            'android.permission.RECORD_AUDIO',
            'android.permission.MODIFY_AUDIO_SETTINGS'
        ]
    },
    web: {
        favicon: './assets/images/favicon.png',
        bundler: 'metro'
    },
    androidStatusBar: {
        translucent: true
    },
    plugins: [
        [
            './withAndroidRemovedPermissions',
            [
                'android.permission.READ_PHONE_STATE'
            ]
        ],
        [
            'expo-notifications',
            {
                icon: './assets/images/notification-icon.png',
                color: '#ffffff',
                androidMode: 'default'
            }
        ],
        [
            'expo-build-properties',
            {
                android: {
                    targetSdkVersion: 33,
                    minSdkVersion: 26
                }
            }
        ],
        [
            'expo-screen-orientation',
            {
                initialOrientation: 'DEFAULT'
            }
        ]
    ],
    extra: {
        eas: {
            projectId: '6e5271a6-5d4f-4a44-a517-0b2c7b9ec853'
        }
    },
    experiments: {
        baseUrl: "/expo"
    },
    owner: 'fa-it'
}
