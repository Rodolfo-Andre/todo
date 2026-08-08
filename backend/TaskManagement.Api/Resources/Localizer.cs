using System.Globalization;
using System.Reflection;
using System.Resources;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Api.Resources;

public class Localizer : ILocalizer
{
    private readonly ResourceManager _resourceManager;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public Localizer(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _resourceManager = new ResourceManager(
            "TaskManagement.Api.Resources.Messages",
            Assembly.GetExecutingAssembly());
    }

    public CultureInfo CurrentCulture => CultureInfo.CurrentCulture;

    public string this[string key] => Get(key);

    public string this[string key, params object[] args] => Get(key, args);

    public string Get(string key)
    {
        var culture = GetCultureFromRequest();
        var value = _resourceManager.GetString(key, culture);
        return value ?? key;
    }

    public string Get(string key, params object[] args)
    {
        var template = Get(key);
        try
        {
            return string.Format(template, args);
        }
        catch
        {
            return template;
        }
    }

    private CultureInfo GetCultureFromRequest()
    {
        var request = _httpContextAccessor.HttpContext?.Request;
        if (request == null)
        {
            return new CultureInfo("es"); // Default to Spanish
        }

        // Check Accept-Language header
        var acceptLanguage = request.Headers["Accept-Language"].FirstOrDefault();
        if (!string.IsNullOrEmpty(acceptLanguage))
        {
            // Parse the language code (e.g., "en-US" -> "en")
            var langCode = acceptLanguage.Split(',')[0].Split('-')[0].ToLower();
            if (langCode == "en" || langCode == "es")
            {
                return new CultureInfo(langCode);
            }
        }

        // Default to Spanish
        return new CultureInfo("es");
    }
}
