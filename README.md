# Azure Functions ExporterV2

This project is a TypeScript-based Azure Functions application that provides API endpoints for data export functionality with Prisma ORM integration.

## Project Structure

```
├── src/
│   ├── functions/           # Azure Functions
│   │   ├── exportPersons.ts # Main export function
│   │   ├── prismaModule.ts  # Prisma client setup
│   │   └── utilities.ts     # Helper utilities
│   └── permissions.ts       # Permission handling
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── dbml/               # Database markup files
├── package.json
├── tsconfig.json
├── host.json               # Azure Functions host configuration
└── local.settings.json     # Local development settings
```

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [VS Code](https://code.visualstudio.com/) with [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Local Settings

Copy and configure your local settings:

```bash
# Create local.settings.json with your database connection and other secrets
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (if applicable)
npx prisma migrate deploy
```

### 4. Build and Run Locally

```bash
# Clean and build
npm run clean
npm run build

# Start the function app locally
npm start
```

Or use the VS Code tasks:
- Press `Ctrl+Shift+P` → "Tasks: Run Task" → "npm watch (functions)" for development with auto-rebuild
- Press `Ctrl+Shift+P` → "Tasks: Run Task" → "func: host start" to start the function host

## Deployment to Azure

### Method 1: Using Azure Functions Extension in VS Code (Recommended)

#### Step 1: Install Azure Functions Extension

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Azure Functions"
4. Install the extension by Microsoft

#### Step 2: Sign in to Azure

1. Press `Ctrl+Shift+P` to open command palette
2. Type "Azure: Sign In" and select it
3. Follow the authentication flow in your browser

#### Step 3: Create Function App in Azure

1. Press `Ctrl+Shift+P`
2. Type "Azure Functions: Create Function App in Azure..."
3. Choose "Create new Function App in Azure"
4. Follow the prompts:
   - **Function App name**: Choose a globally unique name
   - **Runtime stack**: Node.js 18 LTS
   - **Operating System**: Windows or Linux
   - **Location**: Choose your preferred region
   - **Resource Group**: Create new or use existing
   - **Storage Account**: Create new or use existing
   - **Application Insights**: Create new or use existing

#### Step 4: Configure Application Settings

1. In VS Code, open Azure extension panel
2. Navigate to your Function App
3. Right-click on "Application Settings"
4. Select "Add New Setting..." for each environment variable you need:
   - Database connection strings
   - API keys
   - Other configuration values

#### Step 5: Deploy the Function

1. Press `Ctrl+Shift+P`
2. Type "Azure Functions: Deploy to Function App..."
3. Select your Function App
4. Confirm the deployment

The extension will:
- Build your TypeScript code
- Package the application
- Deploy to Azure
- Install npm dependencies on the server

### Method 2: Using Azure CLI

#### Step 1: Login to Azure

```bash
az login
```

#### Step 2: Create Resource Group (if needed)

```bash
az group create --name myResourceGroup --location "East US"
```

#### Step 3: Create Storage Account

```bash
az storage account create --name mystorageaccount --location "East US" --resource-group myResourceGroup --sku Standard_LRS
```

#### Step 4: Create Function App

```bash
az functionapp create --resource-group myResourceGroup --consumption-plan-location "East US" --runtime node --runtime-version 18 --functions-version 4 --name myFunctionApp --storage-account mystorageaccount
```

#### Step 5: Configure App Settings

```bash
# Set your database connection string
az functionapp config appsettings set --name myFunctionApp --resource-group myResourceGroup --settings "DATABASE_URL=your_connection_string"

# Add other required settings
az functionapp config appsettings set --name myFunctionApp --resource-group myResourceGroup --settings "SETTING_NAME=value"
```

#### Step 6: Deploy

```bash
# Build the project
npm run build

# Deploy using func CLI
func azure functionapp publish myFunctionApp
```

## Environment Variables

Configure these application settings in Azure:

- `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: Secret key for JWT token validation (if using authentication)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- Any other environment-specific configuration

## Monitoring and Troubleshooting

### View Logs

#### In VS Code:
1. Open Azure extension
2. Navigate to your Function App
3. Expand "Functions" node
4. Right-click on a function → "Start Streaming Logs"

#### In Azure Portal:
1. Go to your Function App
2. Navigate to "Functions" → Select your function
3. Go to "Monitor" tab to view execution logs

### Common Issues

1. **Build Errors**: Ensure TypeScript compiles without errors locally
2. **Missing Dependencies**: Make sure all required packages are in `dependencies` (not `devDependencies`)
3. **Database Connection**: Verify your connection string and firewall settings
4. **CORS Issues**: Configure CORS settings in the Azure portal under "CORS" section

## Development Workflow

1. Make changes to your TypeScript files
2. Test locally using `npm run watch` and `func start`
3. Commit changes to your repository
4. Deploy using VS Code Azure Functions extension or CLI

## Scripts Available

- `npm run build`: Compile TypeScript to JavaScript
- `npm run watch`: Watch for changes and auto-compile
- `npm run clean`: Remove compiled files
- `npm start`: Build and start function app locally
- `npm test`: Run tests (placeholder)

## Additional Resources

- [Azure Functions TypeScript Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node)
- [Azure Functions VS Code Extension](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Azure Functions Best Practices](https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices)
