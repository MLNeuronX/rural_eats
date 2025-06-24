# Rural Eats - Food Delivery Platform

A comprehensive food delivery platform designed for rural communities, connecting local restaurants with customers through an efficient delivery network.

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd rural-eats
npm install

# 2. Start the frontend
npm run dev

# 3. Start the backend (in another terminal)
cd ../rural-eats-backend
pip install -r requirements.txt
python app.py

# 4. Open http://localhost:3000 in your browser
# Use the demo vendor dashboard to test the order flow and printer onboarding.
```

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: Buyer, Vendor, Driver, and Admin roles
- **Real-time Order Management**: Live order tracking and status updates
- **Payment Processing**: Stripe integration with payment holding until delivery
- **Automated Driver Assignment**: Smart driver matching based on location and availability
- **Toast Notifications**: Real-time status updates and confirmations
- **Responsive Design**: Mobile-first design for all user types

### User Roles

#### 👤 Buyer
- Browse local restaurants and menus
- Add items to cart with real-time updates
- Secure checkout with Stripe payment
- Real-time order tracking
- Order history and reordering

#### 🏪 Vendor
- Menu management with item CRUD operations
- Real-time order notifications
- Order status management
- Automated or manual driver assignment
- Sales analytics and performance metrics

#### 🚗 Driver
- View available orders with earnings preview
- Accept orders with one-click
- Real-time navigation and delivery tracking
- Order status updates
- Earnings tracking and payment processing

#### 👨‍💼 Admin
- Platform-wide analytics and metrics
- User management and role administration
- Order monitoring and dispute resolution
- Revenue tracking and reporting
- System health monitoring

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Sonner** - Toast notifications
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Flask** - Python web framework
- **Supabase** - PostgreSQL database with real-time features
- **JWT** - Authentication and authorization
- **Stripe** - Payment processing and Connect marketplace
- **Python-dotenv** - Environment management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Supabase account
- Stripe account

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rural-eats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd rural-eats-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   cp environment.env.example environment.env
   ```
   
   Update `environment.env` with your configuration:
   ```env
   JWT_SECRET_KEY=your_jwt_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

5. **Initialize database**
   ```bash
   python init_db.py
   ```

6. **Run the server**
   ```bash
   python app.py
   ```

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables**
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
   - `NEXT_PUBLIC_STRIPE_KEY` - Your Stripe publishable key

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend (Render)

1. **Create Render account**
   - Sign up at render.com
   - Connect your GitHub repository

2. **Configure service**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment**: Python 3

3. **Environment Variables**
   - Add all variables from `environment.env`

4. **Deploy**
   - Render will automatically deploy on push to main branch

## 🔧 Configuration

### Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `vendors` - Restaurant information
- `menu_items` - Food items and pricing
- `orders` - Order tracking and status
- `order_items` - Individual items in orders

### API Endpoints

#### Authentication
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `POST /api/vendor/register` - Vendor registration

#### Orders
- `GET /api/order/buyer/orders` - Get buyer orders
- `POST /api/order/orders` - Create new order
- `PUT /api/order/vendor/orders/{id}/status` - Update order status
- `POST /api/order/auto-assign-driver/{id}` - Auto-assign driver

#### Payments
- `POST /api/payment/create-payment-intent` - Create payment intent
- `POST /api/payment/capture-payment` - Capture held payment
- `POST /api/payment/refund-payment` - Refund payment

## 🧪 Testing

### Frontend Testing
```bash
npm run test
npm run test:watch
```

### Backend Testing
```bash
python -m pytest tests/
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Secure payment processing
- Environment variable protection

## 🚨 Error Handling

- Comprehensive error boundaries
- Toast notifications for user feedback
- Loading states for all async operations
- Graceful fallbacks for network issues

## 📊 Analytics

The admin dashboard provides:
- Revenue tracking
- Order analytics
- User metrics
- Driver performance
- Vendor performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🔄 Updates

Stay updated with the latest features:
- Watch the repository for releases
- Follow the changelog
- Join the community discussions 