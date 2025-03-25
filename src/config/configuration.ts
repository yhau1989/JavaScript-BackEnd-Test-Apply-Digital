export default () => ({
  mongo: {
    uri: process.env.DB_URI,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },
});
