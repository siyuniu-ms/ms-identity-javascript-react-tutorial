/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { Container } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';
import { IdTokenData } from './components/DataDisplay';
import { AppInsightsCore } from '@microsoft/1ds-core-js';
import { AuthPlugin, AuthType } from '@microsoft/1ds-auth-js';
import { LocalStorageChannel } from '@microsoft/1ds-localstorage-js';
import { ApplicationInsights } from '@microsoft/1ds-wa-js';
import './styles/App.css';
import { PostChannel } from '@microsoft/1ds-post-js';


const MainContent = () => {
    /**
     * useMsal is a hook that returns the PublicClientApplication instance.
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
     * only render their children if a user is authenticated or unauthenticated, respectively. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
     */
    return (
        <div className="App">
            <AuthenticatedTemplate>
                {activeAccount ? (
                    <Container>
                        <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
                    </Container>
                ) : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};
// Initialize AppInsights
const appInsightsCore = new AppInsightsCore();
const webAnalyticsPlugin = new ApplicationInsights();
const collectorChannelPlugin = new PostChannel();
const authPlugin = new AuthPlugin();
const localStorageChannel = new LocalStorageChannel();
const authConfig = {
    authType: AuthType.MSA,
    loggedInStatusCallback: () => {console.log("logged in"); return true;}};
const TENANT_KEY = "TENANT_KEY";
// var endpoint = 'https://dc.services.visualstudio.com/v2/track' ;

const config = {
    instrumentationKey: TENANT_KEY,
    // endpointUrl: endpoint,
    extensions: [webAnalyticsPlugin, authPlugin, collectorChannelPlugin,],
    channels: [[
        localStorageChannel,
      ]],
    extensionConfig: {
        [webAnalyticsPlugin.identifier]: {
            autoCapture: {
                pageView: true,
                click: true,
                scroll: true,
                onUnload: true,
            },
        },
        [authPlugin.identifier]: authConfig,
    },
};
appInsightsCore.initialize(config, []);

console.log("appInCore", appInsightsCore.isInitialized());

// Send telemetry
appInsightsCore.track({ name: "ReactTelemetryEvent", baseData: {}, baseType: "TestBaseType" });
appInsightsCore.track({ name: "ReactTelemetryEvent", baseData: {}, baseType: "TestBaseType" });
appInsightsCore.track({ name: "ReactTelemetryEvent", baseData: {}, baseType: "TestBaseType" });
appInsightsCore.track({ name: "ReactTelemetryEvent", baseData: {}, baseType: "TestBaseType" });
appInsightsCore.track({ name: "ReactTelemetryEvent", baseData: {}, baseType: "TestBaseType" });
appInsightsCore.flush();

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <MainContent />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;
