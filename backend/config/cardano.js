const axios = require('axios');

class CardanoNetwork {
  constructor() {
    this.network = process.env.CARDANO_NETWORK || 'testnet';
    this.blockfrostApiKey = process.env.BLOCKFROST_API_KEY;
    this.blockfrostUrl = process.env.BLOCKFROST_URL;
    
    // Network configurations
    this.networks = {
      mainnet: {
        id: 1,
        name: 'Mainnet',
        explorer: 'https://cardanoscan.io',
        blockfrost: 'https://cardano-mainnet.blockfrost.io/api/v0',
        networkMagic: 764824073
      },
      testnet: {
        id: 0,
        name: 'Testnet',
        explorer: 'https://testnet.cardanoscan.io',
        blockfrost: 'https://cardano-testnet.blockfrost.io/api/v0',
        networkMagic: 1097911063
      },
      preview: {
        id: 0,
        name: 'Preview',
        explorer: 'https://preview.cardanoscan.io',
        blockfrost: 'https://cardano-preview.blockfrost.io/api/v0',
        networkMagic: 2
      },
      preprod: {
        id: 0,
        name: 'Preprod',
        explorer: 'https://preprod.cardanoscan.io',
        blockfrost: 'https://cardano-preprod.blockfrost.io/api/v0',
        networkMagic: 1
      }
    };
    
    this.currentNetwork = this.networks[this.network];
    
    if (!this.currentNetwork) {
      console.error(`Invalid network: ${this.network}`);
      console.log('Available networks:', Object.keys(this.networks));
      process.exit(1);
    }
  }
  
  // Get current network configuration
  getNetworkConfig() {
    return {
      network: this.network,
      ...this.currentNetwork,
      blockfrostConfigured: !!this.blockfrostApiKey
    };
  }
  
  // Validate Cardano address based on network
  validateAddress(address) {
    // Basic Bech32 validation
    const bech32Regex = /^(addr|stake|addr_test|stake_test)[0-9a-z]+$/i;
    
    if (!bech32Regex.test(address)) {
      return { valid: false, error: 'Invalid address format' };
    }
    
    // Check network compatibility
    const isTestnet = address.startsWith('addr_test') || address.startsWith('stake_test');
    const isMainnet = address.startsWith('addr1') || address.startsWith('stake1');
    
    if (this.network === 'mainnet' && isTestnet) {
      return { valid: false, error: 'Testnet address cannot be used on Mainnet' };
    }
    
    if (this.network !== 'mainnet' && isMainnet) {
      return { valid: false, error: 'Mainnet address cannot be used on Testnet' };
    }
    
    return { valid: true };
  }
  
  // Get address info from Blockfrost
  async getAddressInfo(address) {
    if (!this.blockfrostApiKey) {
      console.warn('Blockfrost API key not configured');
      return null;
    }
    
    try {
      const response = await axios.get(
        `${this.blockfrostUrl}/addresses/${address}`,
        {
          headers: {
            'project_id': this.blockfrostApiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching address info:', error.response?.data || error.message);
      return null;
    }
  }
  
  // Get transaction info from Blockfrost
  async getTransactionInfo(txHash) {
    if (!this.blockfrostApiKey) {
      console.warn('Blockfrost API key not configured');
      return null;
    }
    
    try {
      const response = await axios.get(
        `${this.blockfrostUrl}/txs/${txHash}`,
        {
          headers: {
            'project_id': this.blockfrostApiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error.response?.data || error.message);
      return null;
    }
  }
  
  // Submit transaction to the network
  async submitTransaction(txHex) {
    if (!this.blockfrostApiKey) {
      throw new Error('Blockfrost API key not configured');
    }
    
    try {
      const response = await axios.post(
        `${this.blockfrostUrl}/tx/submit`,
        txHex,
        {
          headers: {
            'project_id': this.blockfrostApiKey,
            'Content-Type': 'application/cbor'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error submitting transaction:', error.response?.data || error.message);
      throw new Error('Failed to submit transaction: ' + (error.response?.data?.message || error.message));
    }
  }
  
  // Get ADA price (from CoinGecko)
  async getADAPrice() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd,eur,gbp'
      );
      return response.data.cardano;
    } catch (error) {
      console.error('Error fetching ADA price:', error.message);
      return null;
    }
  }
  
  // Calculate transaction fee (simplified)
  calculateFee(inputs, outputs, metadata = null) {
    // Base fee: 0.155381 ADA + 0.000043946 ADA per byte
    const baseFee = 155381; // lovelace
    const perByteFee = 43946; // lovelace per byte
    
    // Estimate transaction size
    let size = 200; // base size
    
    // Add size for inputs
    size += inputs * 100;
    
    // Add size for outputs
    size += outputs * 50;
    
    // Add size for metadata if present
    if (metadata) {
      size += JSON.stringify(metadata).length;
    }
    
    const fee = baseFee + (size * perByteFee);
    
    // Return in ADA
    return (fee / 1000000).toFixed(6);
  }
  
  // Get network stats
  async getNetworkStats() {
    if (!this.blockfrostApiKey) {
      return null;
    }
    
    try {
      const [epoch, tip] = await Promise.all([
        axios.get(`${this.blockfrostUrl}/epochs/latest`, {
          headers: { 'project_id': this.blockfrostApiKey }
        }),
        axios.get(`${this.blockfrostUrl}/blocks/latest`, {
          headers: { 'project_id': this.blockfrostApiKey }
        })
      ]);
      
      return {
        epoch: epoch.data.epoch,
        slot: epoch.data.slot,
        blockHeight: tip.data.height,
        blockHash: tip.data.hash,
        timestamp: tip.data.time
      };
    } catch (error) {
      console.error('Error fetching network stats:', error.message);
      return null;
    }
  }
}

module.exports = new CardanoNetwork();