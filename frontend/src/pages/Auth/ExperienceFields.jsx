import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const ExperienceFields = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hardcoded fields
  const fields = [
    { name: "HTML/CSS", icon: "🌐" },
    { name: "JavaScript", icon: "📜" },
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Python", icon: "🐍" },
    { name: "Java", icon: "☕" },
    { name: "C++", icon: "🔧" },
    { name: "SQL", icon: "🗄️" },
    { name: "MongoDB", icon: "🍃" },
    { name: "AWS", icon: "☁️" },
    { name: "Docker", icon: "🐳" },
    { name: "Git", icon: "📚" }
  ];

  const toggleField = (fieldName) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldName)) {
        return prev.filter(name => name !== fieldName);
      } else {
        return [...prev, fieldName];
      }
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Send the actual field names instead of IDs
      await api.patch("/user/add-experience-fields", { experiences: selectedFields });
      
      toast({
        title: "Success",
        description: "Your experience fields have been saved successfully!",
      });
      
      // Navigate to dashboard or home page
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save experience fields:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save your experience fields. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">What are your areas of expertise?</CardTitle>
        <CardDescription className="text-center">
          Select fields where you have experience. This helps us match you with relevant content.
          {selectedFields.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              It's okay if you don't have experience yet - you can skip this step.
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {fields.map((field) => (
            <div
              key={field.name}
              onClick={() => toggleField(field.name)}
              className={`
                p-4 rounded-lg cursor-pointer transition-all
                flex flex-col items-center justify-center text-center gap-2
                border-2 hover:border-primary hover:bg-primary/5
                ${selectedFields.includes(field.name) 
                  ? "border-primary bg-primary/10" 
                  : "border-gray-200 dark:border-gray-700"}
              `}
            >
              <span className="text-3xl">{field.icon}</span>
              <span className="font-medium">{field.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? "Saving..." : selectedFields.length === 0 ? "Skip" : "Finish Setup"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExperienceFields;
