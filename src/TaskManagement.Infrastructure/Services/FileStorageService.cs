using Microsoft.AspNetCore.Http;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly string _baseFilePath;

    public FileStorageService()
    {
        _baseFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        if (!Directory.Exists(_baseFilePath))
        {
            Directory.CreateDirectory(_baseFilePath);
        }
    }

    public async Task<string> UploadFileAsync(IFormFile file, string subDirectory)
    {
        var targetPath = Path.Combine(_baseFilePath, subDirectory);
        if (!Directory.Exists(targetPath))
        {
            Directory.CreateDirectory(targetPath);
        }

        var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(targetPath, uniqueName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(subDirectory, uniqueName);
    }

    public Task DeleteFileAsync(string filePath)
    {
        var fullPath = Path.Combine(_baseFilePath, filePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
        return Task.CompletedTask;
    }

    public string GetFilePath(string fileName, string subDirectory)
    {
        return Path.Combine(_baseFilePath, subDirectory, fileName);
    }
}
