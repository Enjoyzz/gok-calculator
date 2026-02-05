// Мокаем Vuetify полностью
vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn(),
  }),
}));
