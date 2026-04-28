import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env file
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function insertDummyUser() {
    console.log('🔄 Connecting to Supabase...')
    console.log('📡 URL:', supabaseUrl)

    // First, let's check what columns exist by trying to select from users
    console.log('🔍 Checking users table structure...')

    try {
        const { data: testData, error: testError } = await supabase.from('users').select('*').limit(1)
        console.log('✅ Users table exists, current data:', testData)
        if (testError) {
            console.log('⚠️ Select error:', testError.message)
        }
    } catch (e) {
        console.log('⚠️ Could not query users table')
    }

    // Try minimal insert with the correct column name: wallet_address
    const dummyUser = {
      username: 'test_user_001',
      wallet_address: '4pcG5DmRsP7rRu4DyJcELHmH3LFMCv9YGzX7gFeRA7u', // Valid Solana wallet address
    }

    console.log('📝 Inserting dummy user:', dummyUser)

    const { data, error } = await supabase
        .from('users')
        .insert([dummyUser])
        .select()
        .single()

    if (error) {
        console.error('❌ Error inserting user:', error.message)
        console.error('Error details:', error)
        process.exit(1)
    }

    console.log('✅ User inserted successfully!')
    console.log('📋 Inserted user data:', data)
}

insertDummyUser()
    .then(() => {
        console.log('\n🎉 Done!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('💥 Unexpected error:', err)
        process.exit(1)
    })