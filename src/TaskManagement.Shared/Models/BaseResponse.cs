namespace TaskManagement.Shared.Models;

public class BaseResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static BaseResponse<T> CreateSuccess(T data, string? message = null)
    {
        return new BaseResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static BaseResponse<T> CreateFailure(List<string> errors)
    {
        return new BaseResponse<T>
        {
            Success = false,
            Errors = errors
        };
    }

    public static BaseResponse<T> CreateFailure(string error)
    {
        return new BaseResponse<T>
        {
            Success = false,
            Errors = new List<string> { error }
        };
    }

    public static BaseResponse<T> Failure(List<string> errors)
    {
        return CreateFailure(errors);
    }

    public static BaseResponse<T> Failure(string error)
    {
        return CreateFailure(error);
    }
}
