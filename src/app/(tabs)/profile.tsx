import { View, Text } from 'react-native'
import React from 'react'
import { authClient } from '../../lib/auth-client'
import IUser from '../../types/user.type'


const ProfileScreen = () => {
    const {data:session} = authClient.useSession()
      const user = session?.user as IUser | undefined
      

  return (
    <View >
      <Text>
        Welcome <Text className='text-emerald-600' >{user?.name}</Text>
      </Text>
    </View>
  )
}

export default ProfileScreen