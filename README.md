# F1 Fantasy Frontend

> A fantasy Formula 1 application built with Angular 19 that allows users to create teams, compete in leagues, and use AI predictions for race outcomes.

[![License](https://img.shields.io/badge/License-Academic-blue)](LICENSE)

---

## Features

- **Team Management**: Build and manage your fantasy F1 team with drivers and constructors
- **Transfers**: Make strategic transfers between race weeks
- **Leagues**: Create and join public/private leagues to compete with friends
- **AI Predictions**: Use AI to predict qualifying and race results
- **Live Statistics**: Track driver, constructor, and race statistics
- **Powerups**: Strategic boosts for your team performance

---

## Security Features

- Cookie-based authentication
- Protected routes with Angular guards
- Content Security Policy headers

---

## Prerequisites
- Node.js 18.x or higher
- Angular CLI 19.x
- [Backend](https://github.com/linhbuitung/f1-fantasy-backend) API running

---

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/f1-fantasy-frontend.git
cd f1-fantasy-frontend/F1Fantasy
```

2. Install dependencies:
```bash
npm install
```

---

## 🏃 Running the Application

### Development Server

```bash
cd F1Fantasy
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

### Production Build

```bash
ng build --configuration production
```
Build artifacts will be stored in the `dist/` directory.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Clean up subscriptions in `ngOnDestroy`

---

## License

This project is developed as part of a Bachelor's thesis for educational purposes.

- **Author**: Bui Tung Linh
- **University**: PJATK
- **Thesis**: Polish-Japanese Academy of Information Technology

---

## 🙏 Acknowledgments

- F1 data provided by [Jolpica F1 API](https://github.com/jolpica/jolpica-f1/)
- Inspired by official F1 Fantasy game
- Built with love for Formula 1 and Williams Racing

