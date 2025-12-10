import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigator';
import { styles } from './SideBar.styles';

type SideBarNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SideBar'>;

type Props = {
    navigation: SideBarNavigationProp;
};

export default function SideBar({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.menuItem}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                <Text style={styles.menuItem}>Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                <Text style={styles.menuItem}>Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MyShop')}>
                <Text style={styles.menuItem}>MyShop</Text>
            </TouchableOpacity>
        </View>
    );
}
