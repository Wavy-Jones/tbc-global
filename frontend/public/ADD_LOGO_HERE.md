## 📸 Adding the Logo

You need to copy `TBC_logo.jpeg` into the `public` folder so the browser can load it.

### Option 1: Windows Explorer (30 seconds)
1. Find your logo file (TBC_logo.jpeg) - probably in Downloads
2. Copy it (Ctrl+C)
3. Navigate to `C:\Repos\TBC\frontend\public\`
4. Paste it (Ctrl+V)
5. **Rename it to `logo.jpeg`**

### Option 2: VS Code Terminal
```bash
# Replace "C:\Users\YourName\Downloads\TBC_logo.jpeg" with actual path
copy "C:\Users\YourName\Downloads\TBC_logo.jpeg" "C:\Repos\TBC\frontend\public\logo.jpeg"
```

### Verify it worked:
You should now have: `C:\Repos\TBC\frontend\public\logo.jpeg`

Once the file is there, restart the dev server (`npm run dev`) and the logo will appear everywhere!
