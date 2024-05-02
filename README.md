# Fagerhaug Vind

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Description

This site displays real-time wind information received from Oppdal Airport, Fagerhaug (ENOP). It connects to an Elasticsearch database using the environment variables provided.

### GET Parameters

- `fullscreen`: (optional) Specify which graph to view in fullscreen. Accepted values: [`max`, `windrose`]
- `timespan`: (optional) Specify the default time span selected. Any integer is accepted

### Environment Variables

- `API_KEY` - api key to elasticsearch
- `API_URL` - url to elasticsearch

## Technologies

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@eunchurn/react-windrose-chart](https://github.com/eunchurn/react-windrose-chart)
- [@vercel/analytics](https://vercel.com/analytics)
- [React Google Charts](https://www.react-google-charts.com/)

## Notes

React-windrose-chart is not specified as a node dependency, but the source code is cloned and hardcoded into `./src/app/utils/windrose/`. This is because I had to make fine-adjustment changes to fit our needs.
