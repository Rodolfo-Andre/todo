using System.Net;
using System.Text.Json;
using TaskManagement.Domain.Exceptions;
using TaskManagement.Shared.Exceptions;
using TaskManagement.Shared.Models;

namespace TaskManagement.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        var result = exception switch
        {
            ValidationException validationEx => new
            {
                statusCode = (int)HttpStatusCode.BadRequest,
                success = false,
                errors = validationEx.Errors.Values.SelectMany(e => e).ToArray(),
                message = "Validation failed"
            },
            NotFoundException notFoundEx => new
            {
                statusCode = (int)HttpStatusCode.NotFound,
                success = false,
                errors = new[] { notFoundEx.Message },
                message = "Resource not found"
            },
            DomainException domainEx => new
            {
                statusCode = (int)HttpStatusCode.BadRequest,
                success = false,
                errors = new[] { domainEx.Message },
                message = "Business rule violation"
            },
            _ => new
            {
                statusCode = (int)HttpStatusCode.InternalServerError,
                success = false,
                errors = new[] { "An unexpected error occurred" },
                message = "Internal server error"
            }
        };

        response.StatusCode = result.statusCode;

        _logger.LogError(exception, "Unhandled exception occurred: {Message}", exception.Message);

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await response.WriteAsync(JsonSerializer.Serialize(result, jsonOptions));
    }
}
