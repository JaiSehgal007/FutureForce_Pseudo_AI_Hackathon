import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const InterestedAreas = () => {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hardcoded areas
  const areas = [
    { name: "Web ", icon: "🌐" },
    { name: "Mobile ", icon: "📱" },
    { name: "Data Science", icon: "📊" },
    { name: "Machine Learning", icon: "🤖" },
    { name: "UI/UX Design", icon: "🎨" },
    { name: "DevOps", icon: "⚙️" },
    { name: "Cybersec", icon: "🔒" },
    { name: "Cloud", icon: "☁️" },
    { name: "Blockchain", icon: "🔗" },
    { name: "Game ", icon: "🎮" },
    { name: "AR/VR", icon: "👓" },
    { name: "IoT", icon: "🔌" }
  ];

  const toggleArea = (areaName) => {
    setSelectedAreas(prev => {
      if (prev.includes(areaName)) {
        return prev.filter(name => name !== areaName);
      } else {
        return [...prev, areaName];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedAreas.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one area of interest.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      console.log("Sending request with data:", { areas: selectedAreas });
      
      const response = await api.patch("/user/add-interested-areas", { areas: selectedAreas });
      console.log("API response:", response);
      
      toast({
        title: "Success",
        description: "Your interests have been saved successfully!",
      });
      
      // Navigate to experience fields selection
      navigate("/experience-fields");
    } catch (error) {
      console.error("Failed to save interests:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save your interests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">What are you interested in?</CardTitle>
        <CardDescription className="text-center">
          Select areas you're interested in learning. This helps us personalize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {areas.map((area) => (
            <div
              key={area.name}
              onClick={() => toggleArea(area.name)}
              className={`
                p-4 rounded-lg cursor-pointer transition-all
                flex flex-col items-center justify-center text-center gap-2
                border-2 hover:border-primary hover:bg-primary/5
                ${selectedAreas.includes(area.name) 
                  ? "border-primary bg-primary/10" 
                  : "border-gray-200 dark:border-gray-700"}
              `}
            >
              <span className="text-3xl">{area.icon}</span>
              <span className="font-medium">{area.name}</span>
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
          className="relative"
        >
          {submitting ? "Saving..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterestedAreas;
