"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { GenerateForm } from '../generate-article-form';

export function NewArticleDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 w-4 h-4" />
          New Article
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate a new article</DialogTitle>
          <DialogDescription>
            Provide a topic to generate your article with AI.
          </DialogDescription>
        </DialogHeader>
        {/* The GenerateForm component contains the form and submission logic */}
       <GenerateForm onGenerationSuccess={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}