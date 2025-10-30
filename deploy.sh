mv src/constants.json src/constants1.json
echo '{"BACKEND_URL": "https://api.routefivecollectibles.com"}' > src/constants.json
npm run build
rm /var/www/route5-react -r
mv out /var/www/route5-react
mv src/constants1.json src/constants.json