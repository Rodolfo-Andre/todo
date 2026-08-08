using Microsoft.AspNetCore.Http;

namespace TaskManagement.Application.Common.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string subDirectory);
    Task DeleteFileAsync(string filePath);
    string GetFilePath(string fileName, string subDirectory);
}
