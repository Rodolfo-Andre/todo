namespace TaskManagement.Shared.DTOs.Tasks;

public class ReorderTaskRequest
{
    public int OrderIndex { get; set; }
    public int? NewStatus { get; set; }
}
