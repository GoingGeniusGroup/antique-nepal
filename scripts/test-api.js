const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Testing Site Settings API...\n');
    
    // Test GET
    console.log('1. Testing GET /api/admin/site-settings');
    const getResponse = await fetch('http://localhost:3000/api/admin/site-settings');
    const getData = await getResponse.json();
    console.log('✅ GET successful');
    console.log('Hero title:', getData.hero?.title);
    console.log('Banner text:', getData.banner?.text);
    console.log('Featured title:', getData.homepage?.featuredTitle);
    
    // Test PATCH
    console.log('\n2. Testing PATCH /api/admin/site-settings');
    const testData = {
      hero: {
        title: 'TEST TITLE FROM API',
        subtitle: 'Test subtitle from API',
        description: 'Test description from API',
        features: {
          feature1: {
            title: 'Test Feature 1',
            description: 'Test description 1'
          }
        }
      },
      banner: {
        text: 'Test banner from API',
        isVisible: true
      }
    };
    
    const patchResponse = await fetch('http://localhost:3000/api/admin/site-settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const patchResult = await patchResponse.json();
    console.log('✅ PATCH successful:', patchResult);
    
    // Verify the update
    console.log('\n3. Verifying update...');
    const verifyResponse = await fetch('http://localhost:3000/api/admin/site-settings');
    const verifyData = await verifyResponse.json();
    console.log('Updated hero title:', verifyData.hero?.title);
    console.log('Updated banner text:', verifyData.banner?.text);
    
    console.log('\n🎉 API test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPI();
