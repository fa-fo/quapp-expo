const IS_DEV = process.env.APP_VARIANT === 'development';
const versionCode = 28004;

export default {
    name: IS_DEV ? 'DEV QuattFo Quapp' : 'QuattFo Quapp',
    slug: 'quattfo-quapp',
    version: '4.0.0',
    orientation: 'default',
    scheme: 'quapp',
    icon: './assets/images/icon.png',
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
            googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? (IS_DEV ? '' : './GoogleService-Info.plist'),
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/icon.png',
            backgroundColor: '#FFFFFF'
        },
        package: IS_DEV ? 'de.quattfo.quapp.dev' : 'de.quattfo.quapp',
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? (IS_DEV ? '' : './google-services.json'),
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
            'expo-build-properties',
            {
                android: {
                    targetSdkVersion: 34,
                    minSdkVersion: 26
                }
            }
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
            'expo-screen-orientation',
            {
                initialOrientation: 'DEFAULT'
            }
        ],
        [
            'expo-splash-screen',
            {
                imageWidth: 200,
                imageHeight: 200,
                resizeMode: 'contain',
                image: './assets/images/splash.png',
                backgroundColor: '#ffffff',
                dark: {
                    image: './assets/images/splash-dark.png',
                    backgroundColor: '#000000'
                }
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
