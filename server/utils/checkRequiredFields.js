import { formatResponse } from './formatResponse.js';
import { httpStatus } from './httpStatusText.js';

export const checkRequiredFields = (req, res, fields) => {
    const body = req.body;

    const getNestedValue = (field, data) => {
        const fieldParts = field.split('.');
        let value = data;
        for (const part of fieldParts) {
            if (value && typeof value === 'object') {
                value = value[part];
            } else {
                return undefined;
            }
        }
        return value;
    };

    const missingFields = fields.filter(field => !getNestedValue(field, body));

    if (missingFields.length > 0) {
        const message = missingFields.length === 1
            ? `${missingFields[0]} is required`
            : `${missingFields.join(' and ')} are required`;

        res.status(400).json(formatResponse(httpStatus.ERROR, null, message));
        return false;
    }

    return true;
};
