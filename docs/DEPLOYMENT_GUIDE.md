# Deployment Guide: Google Cloud Platform (Firebase) + Free Domain

## 🚀 Quick Start - Deploy to Firebase Hosting

Your Fan-page website is ready to deploy to **Firebase Hosting** (Google Cloud Platform) with a **free custom domain**.

---

## **Step 1: Install Firebase CLI**

```bash
npm install -g firebase-tools
```

---

## **Step 2: Authenticate with Google**

```bash
firebase login
```

This will open your browser to authenticate with your Google account. Log in with the Google account you want to use for Firebase.

---

## **Step 3: Initialize Firebase Project**

```bash
firebase init
```

When prompted:
- **Select Hosting** (use space to select, then Enter)
- **Select "Use an existing project"** or **"Create a new project"**
- Project ID: `fan-page-website` (or your preferred ID)
- Public directory: **`dist`**
- Configure as SPA: **Yes**
- Auto-build: **No** (we handle this via GitHub Actions)
- Overwrite index.html: **No**

---

## **Step 4: Build Your App Locally (Optional Test)**

```bash
npm run build
```

This creates the `dist` folder with your production build.

---

## **Step 5: Deploy to Firebase**

### **Option A: Deploy Locally (for testing)**

```bash
firebase deploy
```

Your site will be live at:  
🌐 `https://fan-page-website.web.app`

### **Option B: Deploy via GitHub Actions (Recommended)**

The workflow is already set up in `.github/workflows/deploy-firebase.yml`. 

To enable automatic deployment:

1. **Create a Firebase Service Account:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to **Project Settings** → **Service Accounts**
   - Click **Generate New Private Key**
   - Save the JSON file

2. **Add GitHub Secret:**
   - Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `FIREBASE_SERVICE_ACCOUNT_FAN_PAGE_WEBSITE`
   - Value: Paste the entire JSON content from the service account key

3. **Push to main branch:**
   ```bash
   git push origin main
   ```
   
   The workflow will automatically:
   - ✅ Install dependencies
   - ✅ Run tests
   - ✅ Build your React app
   - ✅ Deploy to Firebase

---

## **Step 6: Add a Free Custom Domain**

### **Option A: Free Domain from Freenom**

1. Go to [freenom.com](https://www.freenom.com)
2. Search for your desired domain (e.g., `mysite.tk`, `mysite.ml`)
3. Register for **free** (.tk, .ml, .ga, .cf, .gq domains are free)
4. Complete the registration

### **Option B: Google Domains (Paid, but better reliability)**
- Minimum ~$12/year
- Better support and reliability

### **Connect Domain to Firebase:**

1. Go to [Firebase Console Hosting](https://console.firebase.google.com/project/fan-page-website/hosting/sites)
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `mysite.tk`)
4. Firebase will provide **DNS records** (look for CNAME or A records)
5. Go to your domain registrar (Freenom, Google Domains, etc.)
6. Update the **DNS settings** with the records Firebase provided
7. Wait for DNS propagation (15 minutes to 2 hours)
8. Firebase will automatically issue an **SSL certificate** (HTTPS) ✅

---

## **Step 7: Verify Your Deployment**

Visit your live site:
- 🌐 Firebase URL: `https://fan-page-website.web.app`
- 🌐 Custom Domain: `https://yourdomain.tk` (after DNS propagates)

---

## **Automatic Deployment on Every Push**

With GitHub Actions configured:
- Every push to `main` → **Auto-deploy to production**
- Every pull request → **Deploy to preview channel**
- All tests must pass before deployment

---

## **Useful Firebase Commands**

```bash
# View live deployment logs
firebase hosting:log

# List all hosting sites
firebase hosting:sites:list

# Remove a deployment
firebase hosting:disable

# View deployment history
firebase hosting:channel:list
```

---

## **Troubleshooting**

### **Domain not connecting?**
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- Wait up to 48 hours for DNS to fully propagate
- Verify DNS records match exactly what Firebase provided

### **Build fails?**
- Run `npm test` locally to check for errors
- Run `npm run build` to verify build succeeds
- Check GitHub Actions logs for detailed errors

### **Firebase deploy fails?**
- Verify service account key is correct
- Check that `dist` folder exists after build
- Ensure `firebase.json` is in the repository root

---

## **Next Steps**

1. ✅ Create Google account / Firebase project
2. ✅ Run `firebase init` locally
3. ✅ Deploy once to verify it works: `firebase deploy`
4. ✅ Get a free domain from Freenom
5. ✅ Connect domain to Firebase
6. ✅ Enable GitHub Actions for auto-deployment
7. ✅ Share your live website! 🎉

---

## **Resources**

- 📚 [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- 🔗 [Firebase Console](https://console.firebase.google.com/)
- 🌐 [Freenom Free Domains](https://www.freenom.com)
- 🔍 [DNS Propagation Checker](https://whatsmydns.net)

---

**Your app is ready to go live!** 🚀
