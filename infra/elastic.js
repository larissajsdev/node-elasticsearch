const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  node: 'https://e94e32d569f24ad1abb3b738ce4610b3.us-central1.gcp.cloud.es.io', // Elasticsearch endpoint
  auth: {
    username: 'elastic',
    password: 'PweX80JxsxICgTNV4kQsNIWj',
  },
})
module.exports = client
