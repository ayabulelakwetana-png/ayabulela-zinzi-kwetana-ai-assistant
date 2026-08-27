import { AiOutput } from "@/components/brand/AiOutput";
import { AiNotice, EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/brand/Bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/hooks/useSession";
import { useRefreshStudyData, useSubjects } from "@/hooks/useStudyData";
import { generateStudyGuide } from "@/lib/ai.functions";
import { DIFFICULTIES, LEARNING_STYLES, SA_SUBJECTS } from "@/lib/constants";
import { saveContent, upsertTopic } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/study-guide")({
  head: () => ({
    meta: [
      { title: "AI Study Guide — StudyEazy AI" },
      {
        name: "description",
        content: "Generate structured CAPS-aligned matric study guides for any Grade 12 topic.",
      },
      { property: "og:title", content: "AI Study Guide — StudyEazy AI" },
      { property: "og:description", content: "Turn any matric topic into a full structured study guide." },
    ],
  }),
  component: StudyGuidePage;
});

function StudyGuidePage() {
  return null;
}
