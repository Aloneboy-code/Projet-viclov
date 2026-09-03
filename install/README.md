# Fichiers d'installation VicLov

Ce dossier contient les fichiers d'installation de l'application mobile VicLov pour Android.

## Fichiers disponibles

### VicLov-Debug.apk
- **Version** : Debug (pour tests)
- **Taille** : ~4.5 MB
- **Utilisation** : Installation sur appareil Android pour tests
- **Signature** : Non signée (debug)

### VicLov-Release.apk
- **Version** : Release (unsigned)
- **Taille** : ~3.5 MB
- **Utilisation** : Nécessite signature avant déploiement
- **Signature** : Non signée (doit être signée avec un keystore)

## Installation sur Android

### Méthode 1 : Transfert direct
1. Connectez votre appareil Android via USB
2. Activez le "Mode développeur" et "Débogage USB"
3. Copiez le fichier APK sur votre appareil
4. Ouvrez le fichier APK et installez-le

### Méthode 2 : ADB (Android Debug Bridge)
```bash
adb install VicLov-Debug.apk
```

### Méthode 3 : Via email/cloud
1. Envoyez le fichier APK par email ou stockez-le sur Google Drive/Dropbox
2. Téléchargez le fichier sur votre appareil Android
3. Installez-le

## Pour le déploiement sur Google Play Store

Le fichier `VicLov-Release.apk` doit être signé avec un keystore avant d'être uploadé sur le Play Store.

### Génération d'un keystore
```bash
keytool -genkey -v -keystore viclov-release.keystore -alias viclov -keyalg RSA -keysize 2048 -validity 10000
```

### Signature de l'APK
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore viclov-release.keystore VicLov-Release.apk viclov
```

### Génération de l'AAB (Android App Bundle)
```bash
cd android
./gradlew bundleRelease
```
L'AAB sera dans : `android/app/build/outputs/bundle/release/`

## Configuration requise

- **Android** : 7.0 (Nougat) ou supérieur (API 24+)
- **Espace** : ~50 MB après installation
- **Permissions** : Internet, Accès réseau, Vibrations, Stockage

## Notes importantes

- Le fichier Debug peut être installé directement mais ne doit pas être utilisé en production
- Le fichier Release doit être signé avant distribution publique
- Pour les tests internes, utilisez le fichier Debug
- Pour la production, générez un AAB signé pour le Play Store

## Support

Pour toute question sur l'installation ou le déploiement, consultez le guide de déploiement mobile : `../MOBILE_DEPLOYMENT.md`
