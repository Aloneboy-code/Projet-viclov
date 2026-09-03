# Guide de Déploiement Mobile - VicLov

Ce guide explique comment déployer l'application VicLov sur Android et iOS en utilisant Capacitor.

## Prérequis

### Pour Android
- Android Studio installé
- SDK Android (API 33+)
- Java JDK 11 ou supérieur
- Gradle

### Pour iOS
- macOS avec Xcode 15+
- Compte développeur Apple (pour App Store)
- CocoaPods installé

## Structure du Projet

```
viclov/
├── android/          # Projet Android natif
├── ios/              # Projet iOS natif
├── dist/             # Build web de production
├── source/           # Code source React
└── capacitor.config.json
```

## Workflow de Développement

### 1. Développement Web
```bash
npm run dev
```

### 2. Build pour Production
```bash
npm run build
```

### 3. Sync vers les Plateformes Mobiles
```bash
npx cap sync
```

### 4. Ouvrir le Projet Natif

**Android:**
```bash
npx cap open android
```

**iOS:**
```bash
npx cap open ios
```

## Déploiement Android

### 1. Générer l'APK (pour tests)
```bash
cd android
./gradlew assembleDebug
```
L'APK sera dans: `android/app/build/outputs/apk/debug/app-debug.apk`

### 2. Générer l'AAB (pour Play Store)
```bash
cd android
./gradlew assembleRelease
```
L'AAB sera dans: `android/app/build/outputs/bundle/release/app-release.aab`

### 3. Signer l'Application

Créez un fichier `keystore.properties` dans le dossier `android/`:
```properties
storePassword=votre_password
keyPassword=votre_password
keyAlias=votre_alias
storeFile=/chemin/vers/votre.keystore
```

### 4. Publier sur Google Play Store

1. Créez un compte développeur Google Play ($25 une fois)
2. Allez sur [Google Play Console](https://play.google.com/console)
3. Créez une nouvelle application
4. Uploadez le fichier AAB
5. Remplissez les informations requises (description, captures d'écran, etc.)
6. Soumettez pour revue

## Déploiement iOS

### 1. Ouvrir le Projet dans Xcode
```bash
npx cap open ios
```

### 2. Configurer les Signing

1. Sélectionnez le projet dans Xcode
2. Allez dans "Signing & Capabilities"
3. Sélectionnez votre équipe de développement
4. Xcode générera automatiquement les certificats

### 3. Générer l'IPA (pour App Store)

1. Product > Archive
2. Sélectionnez l'archive créée
3. Cliquez sur "Distribute App"
4. Choisissez "App Store Connect"
5. Suivez les instructions

### 4. Publier sur App Store

1. Allez sur [App Store Connect](https://appstoreconnect.apple.com)
2. Créez une nouvelle application
3. Remplissez les informations requises
4. Uploadez l'IPA via Xcode ou Transporter
5. Soumettez pour revue

## Configuration des Métadonnées

### Icônes et Splash Screens

Pour générer les icônes et splash screens:

1. Créez une icône de base (1024x1024 pixels)
2. Utilisez [Capacitor Assets](https://capacitorjs.com/docs/guides/icons-and-splash-screens)
3. Placez les fichiers dans les dossiers appropriés

### Nom de l'Application

Le nom est configuré dans `capacitor.config.json`:
```json
{
  "appName": "VicLov",
  "appId": "com.viclov.app"
}
```

## Scripts Utiles

### Sync complet
```bash
npm run build && npx cap sync
```

### Sync Android uniquement
```bash
npm run build && npx cap sync android
```

### Sync iOS uniquement
```bash
npm run build && npx cap sync ios
```

### Test sur Android (émulateur ou appareil)
```bash
npx cap run android
```

### Test sur iOS (simulateur ou appareil)
```bash
npx cap run ios
```

## Résolution de Problèmes

### Erreur de sync
```bash
npx cap clean
npm run build
npx cap sync
```

### Problèmes de permissions Android
Vérifiez `android/app/src/main/AndroidManifest.xml`

### Problèmes de permissions iOS
Vérifiez `ios/App/App/Info.plist`

## Mise à jour de l'Application

1. Modifiez le code source
2. `npm run build`
3. `npx cap sync`
4. Ouvrez le projet natif et build

## Notes Importantes

- **Android**: Le build de production nécessite une signature
- **iOS**: Nécessite un compte développeur Apple ($99/an)
- **Test**: Utilisez les builds debug pour les tests internes
- **Version**: Incrémentez le numéro de version dans les fichiers natifs avant chaque release

## Support

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Forum Ionic](https://forum.ionicframework.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
