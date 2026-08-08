using System.Net;
using System.Text.Json;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Exceptions;
using TaskManagement.Shared.Exceptions;
using TaskManagement.Shared.Models;

namespace TaskManagement.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly ILocalizer _localizer;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, ILocalizer localizer)
    {
        _next = next;
        _logger = logger;
        _localizer = localizer;
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
                message = _localizer.Get("ValidationError")
            },
            NotFoundException notFoundEx => new
            {
                statusCode = (int)HttpStatusCode.NotFound,
                success = false,
                errors = new[] { notFoundEx.Message },
                message = _localizer.Get("NotFound")
            },
            DomainException domainEx => new
            {
                statusCode = (int)HttpStatusCode.BadRequest,
                success = false,
                errors = new[] { domainEx.Message },
                message = _localizer.Get("BusinessRuleViolation")
            },
            _ => new
            {
                statusCode = (int)HttpStatusCode.InternalServerError,
                success = false,
                errors = new[] { _localizer.Get("UnexpectedError") },
                message = _localizer.Get("InternalServerError")
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
