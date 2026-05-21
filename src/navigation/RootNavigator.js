/**
 * Root Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import { THEME } from '@utils/theme';
import { SCREEN_NAMES } from '@utils/constants';
import { logger } from '@utils/logger';

import HomeScreen from '@screens/HomeScreen';
import CreateScreen from '@screens/CreateScreen';
import DetailScreen from '@screens/DetailScreen';
import SearchScreen from '@screens/SearchScreen';
import SettingsScreen from '@screens/SettingsScreen';
import ArchiveScreen from '@screens/ArchiveScreen';

const Stack = createStackNavigator();

const screenOptions = {
    headerStyle: {
        backgroundColor: THEME.colors.bg_secondary,
        borderBottomColor: THEME.colors.border_medium,
        borderBottomWidth: 1,
    },
    headerTintColor: THEME.colors.primary,
    headerTitleStyle: {
        fontWeight: '600',
        color: THEME.colors.text_primary,
    },
    headerBackTitleVisible: false,
    cardStyle: {
        backgroundColor: THEME.colors.bg_dark,
    },
};

const RootNavigator = () => {
    return (
        <>
            <StatusBar style="light" backgroundColor={THEME.colors.bg_dark} />
            <NavigationContainer
                onReady={() => {
                    logger.log('Navigation ready');
                }}
                onStateChange={() => {
                    logger.log('Navigation state changed');
                }}
            >
                <Stack.Navigator
                    screenOptions={screenOptions}
                    initialRouteName={SCREEN_NAMES.HOME}
                >
                    <Stack.Screen
                        name={SCREEN_NAMES.HOME}
                        component={HomeScreen}
                        options={{
                            title: 'Neuron Sparks',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name={SCREEN_NAMES.CREATE}
                        component={CreateScreen}
                        options={{
                            title: 'New Note',
                            headerShown: false,
                            animationEnabled: true,
                        }}
                    />
                    <Stack.Screen
                        name={SCREEN_NAMES.DETAIL}
                        component={DetailScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name={SCREEN_NAMES.SEARCH}
                        component={SearchScreen}
                        options={{
                            title: 'Search Notes',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name={SCREEN_NAMES.SETTINGS}
                        component={SettingsScreen}
                        options={{
                            title: 'Settings',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name={SCREEN_NAMES.ARCHIVE}
                        component={ArchiveScreen}
                        options={{
                            title: 'Archived Notes',
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

export default RootNavigator;