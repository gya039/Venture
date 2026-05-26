# Deploying Venture — Firebase App Hosting

Venture uses Next.js API routes (server-side OpenAI calls), so it needs
a Node.js runtime. **Firebase App Hosting** handles this natively and keeps
everything inside Firebase.

**Requires:** Blaze (pay-as-you-go) plan — but for a personal project you'll
almost certainly stay within the free tier and pay $0.

---

## One-time setup

### 1. Upgrade to Blaze plan
Go to: https://console.firebase.google.com/project/venture-41960/usage/details  
Click **Modify plan** → **Blaze** → confirm with your billing info.

> You won't be charged unless you exceed the free tier (125,000 req/month,
> 360 build-minutes/month). Firebase will alert you before any charges.

---

### 2. Push code to GitHub (required by App Hosting)

Firebase App Hosting deploys from a GitHub repository. You need to push
Venture there first.

```bash
# Create a new repo at github.com/new  (call it "venture")
# Then from E:\Venture:

git add -A
git commit -m "Week 4 complete — Day Pass Calculator, PWA, App Hosting config"
git remote add origin https://github.com/YOUR_USERNAME/venture.git
git branch -M main
git push -u origin main
```

---

### 3. Initialise Firebase App Hosting

```bash
firebase init apphosting
```

When prompted:
- **Select your Firebase project** → `venture-41960`
- **Region** → `europe-west1` (closest to your users) or `us-central1`
- **Connect to GitHub** → yes → authenticate → select your `venture` repo
- **Branch to deploy** → `main`
- **Create a new backend?** → yes → name it `venture`
- **Set as live backend?** → yes

---

### 4. Store your secrets in Firebase Secret Manager

Run each command and paste the value when prompted:

```bash
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_PROJECT_ID
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_APP_ID
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
firebase apphosting:secrets:set NEXT_PUBLIC_MAPBOX_TOKEN
firebase apphosting:secrets:set OPENAI_API_KEY
```

Firebase will ask "Grant access to App Hosting service accounts?" → **Y**

---

### 5. Deploy

```bash
firebase apphosting:backends:deploy venture
```

Or just push to `main` — App Hosting auto-deploys on every push:

```bash
git push
```

Your live URL will be:
`https://venture--venture-XXXXXXXX.REGION.hosted.app`

You can also add a custom domain in the Firebase Console under
**Hosting → App Hosting → venture → Custom domains**.

---

## After deploying

### Update Firebase Auth authorized domains
Go to: https://console.firebase.google.com/project/venture-41960/authentication/settings  
**Authorized domains** → **Add domain** → paste your `.hosted.app` URL.

Without this, Google Sign-In will be blocked on the live site.

---

## Firestore rules + indexes

Deploy any time rules change:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Subsequent deploys

Just push to `main` — App Hosting picks it up automatically:
```bash
git add -A
git commit -m "your message"
git push
```

Monitor builds at:
https://console.firebase.google.com/project/venture-41960/apphosting
