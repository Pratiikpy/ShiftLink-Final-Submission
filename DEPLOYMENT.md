# ShiftLink Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- SideShift.ai affiliate ID (optional but recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: ShiftLink cross-chain gifting protocol"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_PROJECT_ID` | Your WalletConnect Project ID | ✅ Required |
| `NEXT_PUBLIC_SIDESHIFT_AFFILIATE_ID` | Your SideShift affiliate ID | ⚠️ Recommended |
| `SIDESHIFT_SECRET` | Your SideShift API secret | ⚠️ Recommended |

#### Getting Your Credentials:

**WalletConnect Project ID:**
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID

**SideShift Affiliate ID:**
1. Contact SideShift.ai to register as an affiliate
2. Use the provided affiliate ID
3. Current ID in repo: `bOepyfVN8`

**SideShift Secret (Optional):**
1. Register at [sideshift.ai](https://sideshift.ai)
2. Request API access
3. Generate an API secret

### Step 4: Post-Deployment Checklist

- [ ] Test wallet connection
- [ ] Create a test gift link (use small amount like $5)
- [ ] Verify QR code generation
- [ ] Test claiming flow
- [ ] Check transaction tracking
- [ ] Verify all block explorer links work
- [ ] Test on mobile devices

## Deployment Settings

### Build Settings (Auto-detected by Vercel)
- **Framework:** Next.js
- **Build Command:** `npm run build` or `yarn build`
- **Output Directory:** `.next`
- **Install Command:** `npm install` or `yarn install`
- **Node Version:** 20.x (recommended)

### Custom Domain (Optional)
After deployment, you can add a custom domain:
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

## Troubleshooting

### Build Errors
- **"Module not found"**: Run `npm install` locally and check package.json
- **TypeScript errors**: Run `npm run build` locally to verify
- **Environment variables not working**: Ensure variables start with `NEXT_PUBLIC_` for client-side access

### Runtime Errors
- **Wallet connection fails**: Check `NEXT_PUBLIC_PROJECT_ID` is set correctly
- **Shift creation fails**: Verify `SIDESHIFT_SECRET` or check regional restrictions
- **Transaction not found**: Ensure correct network RPC endpoints

## Performance Optimization

### Recommended Vercel Settings
- **Regions**: Edge (auto)
- **Analytics**: Enable for monitoring
- **Speed Insights**: Enable for performance tracking

### Monitoring
- Set up Vercel Analytics to track page load times
- Monitor error rates in Vercel Logs
- Use SideShift.ai dashboard to track shifts

## Security Considerations

1. **Never commit `.env.local`** - Already in .gitignore ✅
2. **Rotate secrets regularly** - Especially if exposed
3. **Use SIDESHIFT_SECRET** - For production deployments
4. **Enable CORS properly** - Next.js handles this by default

## Cost Estimate

**Vercel Free Tier Includes:**
- 100GB bandwidth/month
- 6,000 build minutes/month
- Automatic HTTPS
- Edge Network

**This is more than enough for:**
- Buildathon submission
- Demo purposes
- Initial user testing
- Up to ~10,000 visitors/month

## Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **SideShift API**: [sideshift.ai/api](https://sideshift.ai/api)
- **WalletConnect**: [docs.walletconnect.com](https://docs.walletconnect.com)

---

**🚀 Estimated Deployment Time: 5-10 minutes**
