export const loadExpressApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  return app;
};