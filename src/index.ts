import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { executeSkyLedgerIntegration } from './main';

export const handler = async (context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    const response = await executeSkyLedgerIntegration();
    
    return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: {
            'Content-Type': 'application/json',
        },
    }

};