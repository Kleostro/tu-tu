import { HttpErrorResponse } from "@angular/common/http";

interface Error {
    message: string;
    reason: string;
}

export interface OverriddenHttpErrorResponse extends HttpErrorResponse {
    error: Error;
}
