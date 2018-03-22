import { Exception } from "@michaelcoxon/utilities";


export class InvalidOperationException extends Exception
{
    constructor(message?: string, innerException?: Exception)
    {
        if (innerException)
        {
            super(message!, innerException);
        }
        else
        {
            if (message)
            {
                super(message);
            }
            else
            {
                super();
            }
        }
        this.name = 'InvalidOperationException';
    }
}