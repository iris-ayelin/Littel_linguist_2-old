import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  NgModule,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CategoriesService } from "../services/categories.service";
import { Category } from "../../shared/model/category";
import { MatCardModule } from "@angular/material/card";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ConfirmExitDialogComponent } from "../confirm-exit-dialog/confirm-exit-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialog, MatDialogContent, MatDialogModule } from "@angular/material/dialog";
import { ReturnAnswerDialogComponent } from "../return-answer-dialog/return-answer-dialog.component";

@Component({
  selector: "app-mixed-letters-game",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogContent,
    MatDialogModule
  ],
  templateUrl: "./mixed-letters-game.component.html",
  styleUrls: ["./mixed-letters-game.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class MixedLettersGameComponent implements OnInit {
  @Input() id = "";
  currentCategory?: Category;
  randomWord: { origin: string; target: string } | null = null;
  originWord: string | null = null;
  userGuess: string = "";
  isCorrect: boolean = false;
  feedbackMessage: string | undefined;
  inputWord: string = "";
  progressValue: number = 0;
  incrementValue: number = 0;
  readonly confirmDialog = inject(MatDialog);

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    public answerDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const categoryId = parseInt(params.get("id") || "null");
      this.currentCategory = this.categoriesService.get(categoryId);
      if (this.currentCategory) {
        this.setRandomWord();
      }
    });
  }

  private setRandomWord(): void {
    if (this.currentCategory) {
      this.randomWord = this.getRandomWord(this.currentCategory.words);
      if (this.randomWord) {
        this.originWord = this.scrambleWord(this.randomWord.origin);
      }
    }
  }

  private getRandomWord(
    words: { origin: string; target: string }[]
  ): { origin: string; target: string } | null {
    if (words.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  private scrambleWord(word: string): string {
    const scrambled = word.split("");

    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled.join("");
  }

  checkGuess(): void {
    const inputWordCorrect = this.userGuess.trim().toLowerCase() === this.randomWord?.origin.toLowerCase();
  
    this.isCorrect = inputWordCorrect;
  
    if (this.isCorrect) {
      this.userGuess = "";
      this.setRandomWord();
      this.calculateIncrementValue(); 
      this.handleCorrectAnswer();
      this.openAnswerDialog(true);
    } else {
      this.openAnswerDialog(false);
    }
  }

  calculateIncrementValue() {
    if(this.currentCategory){
      const totalWords = this.currentCategory.words.length;
      if (totalWords) {
        this.incrementValue = 100 / totalWords;
        console.log(this.incrementValue)
      }
    }
  }

  handleCorrectAnswer() {
    this.progressValue += this.incrementValue;
    if (this.progressValue >= 100) {
      this.progressValue = 100;
    }
  }

  resetForm(): void {
    this.userGuess = "";
  }
  
  openConfirmDialog() {
    this.confirmDialog.open(ConfirmExitDialogComponent);
  }

  openAnswerDialog(isCorret: Boolean): void {
    const dialogData = {
      feedbackMessage: this.isCorrect ? "Correct! Guess the next word" : "Try again!",
      isCorrect: this.isCorrect
    };

    this.answerDialog.open(ReturnAnswerDialogComponent, {
      data: dialogData,
      width: '80vw', // Adjust width to fit content
      maxWidth: '350px', // Maximum width for large screens
      height: 'auto' // Adjust height based on content
    });
  }

  exitGame(): void {
    this.openConfirmDialog()
  }
}
