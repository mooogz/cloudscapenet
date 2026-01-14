"use client";

import { useState } from "react";
import {
  useCoAgent,
  useFrontendTool,
  useHumanInTheLoop,
  useRenderToolCall,
} from "@copilotkit/react-core";
import {
  CopilotKitCSSProperties,
  CopilotSidebar,
} from "@copilotkit/react-ui";
import { CloudProvider } from "@/components/cloud-maps";
import { CloudProviderSelector } from "@/components/cloud-provider-selector";
import { CloudServiceMap } from "@/components/cloud-service-map";
import { AgentState } from "@/lib/types";

export default function CloudScapeNetPage() {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(
    null
  );
  const [themeColor, setThemeColor] = useState("#6366f1");

  // 🪁 Frontend Actions
  useFrontendTool({
    name: "setThemeColor",
    description: "Set the theme color of the application",
    parameters: [
      {
        name: "themeColor",
        type: "string",
        description: "The theme color to set. Make sure to pick nice colors.",
        required: true,
      },
    ],
    handler: async ({ themeColor }) => {
      setThemeColor(themeColor);
    },
  });

  // 🪁 Frontend Action: Select Cloud Provider
  useFrontendTool({
    name: "selectCloudProvider",
    description: "Select a cloud provider to view available services",
    parameters: [
      {
        name: "provider",
        type: "string",
        description: "The cloud provider to select (gcp, aws, azure, oci, ibm)",
        required: true,
      },
    ],
    handler: async ({ provider }) => {
      setSelectedProvider(provider as CloudProvider);
    },
  });

  return (
    <main
      style={
        { "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties
      }
    >
      <CopilotSidebar
        disableSystemMessage={true}
        clickOutsideToClose={false}
        labels={{
          title: "CloudScapeNet Agent",
          initial:
            "👋 Hi! I'm the CloudScapeNet AI Agent. Select a cloud provider to get started.",
        }}
        suggestions={[
          {
            title: "Explore GCP",
            message: "Show me Google Cloud services.",
          },
          {
            title: "View AWS",
            message: "I want to see Amazon Web Services.",
          },
          {
            title: "Check Azure",
            message: "Tell me about Microsoft Azure.",
          },
          {
            title: "Oracle Cloud",
            message: "What does Oracle Cloud offer?",
          },
          {
            title: "IBM Services",
            message: "Show me IBM Cloud services.",
          },
          {
            title: "Data Integration",
            message: "How do I replicate data across clouds?",
          },
        ]}
      >
        {selectedProvider ? (
          <CloudServiceMapView
            provider={selectedProvider}
            onBack={() => setSelectedProvider(null)}
            themeColor={themeColor}
          />
        ) : (
          <CloudProviderSelector
            onSelect={setSelectedProvider}
            selectedProvider={selectedProvider || undefined}
          />
        )}
      </CopilotSidebar>
    </main>
  );
}

interface CloudServiceMapViewProps {
  provider: CloudProvider;
  onBack: () => void;
  themeColor: string;
}

function CloudServiceMapView({
  provider,
  onBack,
  themeColor,
}: CloudServiceMapViewProps) {
  // 🪁 Shared State
  const { state, setState } = useCoAgent<AgentState>({
    name: "cloud_agent",
    initialState: {
      proverbs: ["CloudScapeNet: Multi-cloud integration made easy."],
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header with back button */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
        >
          <span className="text-lg">←</span>
          <span className="font-medium">Back to Providers</span>
        </button>

        {/* Service Map */}
        <div
          className="bg-white rounded-xl shadow-lg p-8"
          style={{
            borderTop: `4px solid ${themeColor}`,
          }}
        >
          <CloudServiceMap
            provider={provider}
            onServiceSelect={(service, category) => {
              console.log(`Selected ${service} in ${category}`);
            }}
          />
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl mb-2">1️⃣</div>
              <h3 className="font-semibold text-gray-800 mb-2">Select Services</h3>
              <p className="text-sm text-gray-600">
                Choose services from the map above that you want to integrate.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl mb-2">2️⃣</div>
              <h3 className="font-semibold text-gray-800 mb-2">Configure Pipeline</h3>
              <p className="text-sm text-gray-600">
                The AI agent automatically selects optimal tools for your needs.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-2xl mb-2">3️⃣</div>
              <h3 className="font-semibold text-gray-800 mb-2">Deploy & Monitor</h3>
              <p className="text-sm text-gray-600">
                Execute with real-time monitoring and automatic failover.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
