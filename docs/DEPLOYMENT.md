# Deployment Guide

This guide covers different deployment options for ModernShop e-commerce platform.

## 🚀 Quick Deploy Options

### Replit (Recommended for beginners)
1. Fork the repository to your GitHub account
2. Import project into Replit from GitHub
3. Add environment variables in Replit Secrets:
   ```
   DATABASE_URL=your_mongodb_connection_string
   SESSION_SECRET=your-random-secret-key
   ```
4. Click "Deploy" button in Replit interface
5. Your store will be live at `https://your-project-name.replit.app`

### Vercel (Frontend + Serverless)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add SESSION_SECRET

# Deploy to production
vercel --prod
```

### Railway (Full-stack with database)
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will automatically deploy on every push to main branch

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/modernshop`
4. Add to `DATABASE_URL` environment variable

### PostgreSQL (Alternative)
```bash
# Install PostgreSQL locally or use cloud service
# Update .env
DATABASE_URL=postgresql://user:password@localhost:5432/modernshop

# Run migrations
npm run db:push
```

## 🔧 Environment Variables

Create these environment variables in your deployment platform:

### Required
```env
DATABASE_URL=your_database_connection_string
SESSION_SECRET=your-super-secret-session-key-min-32-chars
NODE_ENV=production
```

### Optional
```env
# Payment processing
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key

# Analytics
VITE_GA_TRACKING_ID=GA-XXXXXXXXX

# Custom domain (for Replit)
REPLIT_DOMAINS=yourdomain.com,www.yourdomain.com
```

## 🏗️ Production Build

### Manual Build Process
```bash
# Install dependencies
npm install

# Build frontend and backend
npm run build

# Start production server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -t modernshop .
docker run -p 5000:5000 --env-file .env modernshop
```

## 🌐 Custom Domain Setup

### Replit Custom Domain
1. Purchase domain from registrar
2. Add domain to Replit project settings
3. Update DNS records:
   ```
   Type: CNAME
   Name: @
   Value: your-project-name.replit.app
   ```

### Vercel Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS with provided values
3. SSL certificate is automatically provisioned

## 🔒 Security Checklist

### Pre-deployment Security
- [ ] Strong `SESSION_SECRET` (minimum 32 characters)
- [ ] Database connection uses SSL
- [ ] Environment variables contain no sensitive data in code
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled for API endpoints

### Post-deployment Security
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Backup strategy implemented

## 📊 Performance Optimization

### Frontend Optimization
```bash
# Analyze bundle size
npm run build
npm run analyze

# Enable compression
# Add to your reverse proxy/CDN
```

### Backend Optimization
- Enable MongoDB/PostgreSQL connection pooling
- Implement Redis caching for sessions
- Use CDN for static assets
- Enable gzip compression

## 🔍 Monitoring & Logging

### Application Monitoring
```javascript
// Add to your deployment
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Error Tracking
Consider integrating:
- Sentry for error tracking
- New Relic for performance monitoring
- DataDog for infrastructure monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🆘 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Database Connection Issues**
- Check connection string format
- Verify network access (IP whitelist for MongoDB Atlas)
- Ensure database user has correct permissions

**Environment Variables Not Loading**
- Verify variable names match exactly
- Check deployment platform's environment variable interface
- Restart application after adding variables

### Performance Issues
- Check database query performance
- Monitor memory usage
- Enable application logging
- Use performance monitoring tools

## 📞 Support

If you encounter deployment issues:
1. Check our [troubleshooting guide](../README.md#troubleshooting)
2. Search existing [GitHub issues](https://github.com/yourusername/modernshop/issues)
3. Create a new issue with deployment details

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Docker Documentation](https://docs.docker.com/)