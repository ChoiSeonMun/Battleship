# Build Instructions

1. From command line, run these in order:

- Bolt Server:
```
msbuild build.msbuild /v:m /t:Server
```

- Bolt Cloud
```
msbuild build.msbuild /v:m /t:Cloud
```

2. Open unity project in bolt_samples
3. Run `Bolt Package/Package Everything` from the top menu
4. Run `Bolt Package/Clean Project` from the top menu
5. IMPORTANT: Delete any packages you dont want in the released package from "bolt/packages" in the project folder. For example Steam, XBoxOne and PlayStation4 plugins from the asset store release.
6. Run `Bolt Package/Package Bolt` from the top menu (optional), this will create a `bolt.unitypackage` inside the `Assets` folder.
7. Make sure `Always show this on startup` is checked in the welcome window.
8. Now everything is ready to be exported/uploaded to asset store, only the *bolt* folder needs to be packaged.
9. Run `git reset --hard` from the project root to restore all files deleted in Step 4.
