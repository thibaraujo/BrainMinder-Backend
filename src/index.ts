import app from './app';

app.listen(process.env.SERVER_PORT, () => {
  console.log('Express listening on port', process.env.SERVER_PORT);
});
