vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn(),
  }),
}));
