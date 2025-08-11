# MoversDelight - Professional Delivery & Logistics Website

A modern, responsive single-page application for a delivery logistics company. This project showcases a professional website with package tracking functionality, contact forms, and a beautiful user interface.

## 🚀 Features

### Core Functionality
- **Package Tracking System**: Real-time package tracking with detailed timeline
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Contact Section**: Complete contact form with business information
- **Interactive Elements**: Smooth animations and hover effects
- **Modern Navigation**: Fixed navbar with smooth scrolling

### Key Sections
1. **Hero Section**: Eye-catching landing area with tracking functionality
2. **Services**: Showcase of delivery and logistics services
3. **About**: Company information with statistics
4. **Contact**: Contact form and business details
5. **Footer**: Social links and additional information

## 🎯 Demo Tracking Numbers

To test the tracking functionality, use these sample tracking numbers:

- `MD123456789` - Package in transit
- `MD987654321` - Package delivered
- `MD555666777` - Package pending

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality and animations
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Inter font family for typography

## 📁 Project Structure

```
Movers/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/letsdoitdotcom/Movers.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Movers
   ```

3. Open `index.html` in your web browser:
   - Double-click the `index.html` file, or
   - Use a local server (recommended for development)

### Using a Local Server (Optional)
For the best development experience, you can use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Secondary**: Light gray (#f8fafc)
- **Text**: Dark gray (#1e293b)
- **Accent**: Blue (#2563eb)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Animations
- Smooth scrolling navigation
- Hover effects on cards and buttons
- Loading animations for tracking
- Scroll-triggered animations
- Floating hero graphic

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔧 Customization

### Adding New Tracking Numbers
To add new tracking numbers, edit the `sampleTrackingData` object in `script.js`:

```javascript
const sampleTrackingData = {
    'YOUR_TRACKING_NUMBER': {
        number: 'YOUR_TRACKING_NUMBER',
        status: 'in-transit', // 'in-transit', 'delivered', 'pending'
        statusText: 'In Transit',
        origin: 'Origin City, State',
        destination: 'Destination City, State',
        estimatedDelivery: 'YYYY-MM-DD',
        timeline: [
            {
                date: 'YYYY-MM-DD HH:MM AM/PM',
                title: 'Event Title',
                description: 'Event description',
                active: true // true for completed events
            }
            // Add more timeline events...
        ]
    }
};
```

### Styling Customization
- Colors can be modified in the CSS variables at the top of `styles.css`
- Fonts can be changed by updating the Google Fonts link in `index.html`
- Layout can be adjusted by modifying the CSS Grid and Flexbox properties

## 🎯 Key Features Explained

### Package Tracking
- Real-time tracking simulation
- Detailed timeline with status indicators
- Modal popup for tracking results
- Error handling for invalid tracking numbers

### Contact Form
- Form validation
- Simulated submission with loading state
- Success message display
- Responsive design

### Navigation
- Fixed navbar with scroll effects
- Mobile hamburger menu
- Smooth scrolling to sections
- Active state indicators

## 🔍 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is created for learning purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please contact:
- Email: info@moversdelight.com
- Phone: +1 (555) 123-4567

## 🎉 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Modern CSS techniques and best practices
- Responsive design principles

---

**Note**: This is a learning project showcasing modern web development techniques. The tracking functionality uses sample data for demonstration purposes.
